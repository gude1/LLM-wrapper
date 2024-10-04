import { useState, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import type {
  ScrapingRequest,
  ScrapingResult,
  ScrapingProgress,
} from "@/types/scraper";

const CHUNK_SIZE = 1024; // 1KB chunks for progress calculation

export function useWebScraper() {
  const [results, setResults] = useState<ScrapingResult[]>([]);
  const [progress, setProgress] = useState<ScrapingProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortController = useRef<AbortController | null>(null);

  const initializeProgress = useCallback((requests: ScrapingRequest[]) => {
    setProgress(
      requests.map((req) => ({
        url: req.url,
        progress: 0,
        status: "pending",
      }))
    );
  }, []);

  const updateProgress = useCallback(
    (url: string, newProgress: number, status: ScrapingProgress["status"]) => {
      setProgress((prev) =>
        prev.map((p) =>
          p.url === url ? { ...p, progress: newProgress, status } : p
        )
      );
    },
    []
  );

  const scrapeWithAxios = useCallback(
    async (request: ScrapingRequest): Promise<ScrapingResult> => {
      const { url, maxExecutionTime } = request;

      try {
        const response = await axios.get(url, {
          timeout: maxExecutionTime * 1000,
          signal: abortController.current?.signal,
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) /
                (progressEvent.total || CHUNK_SIZE * 10)
            );
            updateProgress(url, percentCompleted, "loading");
          },
        });

        const $ = cheerio.load(response.data);
        $("script, style, meta, link, noscript").remove();
        const content = $("body")
          .text()
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 1000000);

        updateProgress(url, 100, "completed");
        return { url, content };
      } catch (error) {
        updateProgress(url, 0, "error");

        let errorMessage = "Unknown error occurred";
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        return {
          url,
          content: null,
          error: errorMessage,
        };
      }
    },
    [updateProgress]
  );

  const startScraping = useCallback(
    async (requests: ScrapingRequest[]) => {
      if (!requests.length) return;

      // Cancel any ongoing scraping
      if (abortController.current) {
        abortController.current.abort();
      }

      setIsLoading(true);
      setError(null);
      setResults([]);
      initializeProgress(requests);

      // Create new AbortController for this batch
      abortController.current = new AbortController();

      try {
        const scrapePromises = requests.map(async (request) => {
          try {
            return await Promise.race([
              scrapeWithAxios(request),
              new Promise<ScrapingResult>((_, reject) =>
                setTimeout(
                  () => reject(new Error(`Timeout for ${request.url}`)),
                  request.maxExecutionTime * 1000
                )
              ),
            ]);
          } catch (error) {
            let errorMessage = "Unknown error occurred";
            if (error instanceof Error) {
              errorMessage = error.message;
            }

            return {
              url: request.url,
              content: null,
              error: errorMessage,
            };
          }
        });

        const newResults = await Promise.all(scrapePromises);
        setResults(newResults);
      } catch (error) {
        let errorMessage = "Unknown error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        abortController.current = null;
      }
    },
    [initializeProgress, scrapeWithAxios]
  );

  const cancelScraping = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setIsLoading(false);
  }, []);

  return {
    results,
    progress,
    isLoading,
    error,
    startScraping,
    cancelScraping,
  };
}

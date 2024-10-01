import TextEditor from "@/components/TextEditor";

export default function Home() {
  return (
    <>
      <main className="min-h-screen border-2 border-red-700 mb-36"></main>
      <footer className="min-h-32 fixed z-40 bg-background px-5 bottom-0 left-0 right-0 md:ml-64 flex justify-center">
        <TextEditor />
      </footer>
    </>
  );
}

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/Progress";

interface WebScrappingProgressDialogProps {
  open?: boolean;
  onOpenChange?(open: boolean): void;
}
const WebScrappingProgressDialog: React.FC<WebScrappingProgressDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] p-0 pb-[15px] rounded-lg overflow-hidden bg-border max-w-[33.9375rem]">
        <DialogHeader className="px-5 bg-[#2D2D2D] h-[3.3125rem] flex flex-row items-center">
          <DialogTitle className="flex items-center text-[#9B9B9B] font-inter font-medium text-sm leading-[0.9075rem]">
            Searching 8 of 10 websites
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <div className="flex h-[3.6875rem] justify-between">
            <div className="flex items-center">
              <div className="flex justify-center mr-4 bg-emerald-green-opaque items-center w-6 h-6 rounded-full">
                <Check className="text-emerald-green" size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-inter text-[#ECECEC] font-semibold text-sm leading-[1.05875rem]">
                  Cyprus - Cyprus Mail
                </span>
                <span className="font-inter text-[#9B9B9B] font-medium text-xs leading-[0.9075rem]">
                  cyprus-mail.com
                </span>
              </div>
            </div>
            <span className="ml-4 font-inter font-medium text-xs  self-center leading-[0.9075rem] text-emerald-green">
              Complete
            </span>
          </div>

          <Progress value={66} className="h-[0.1875rem] bg-[#3C3C3C]" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default WebScrappingProgressDialog;

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "213798323776";

export function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-lg hover:brightness-110 transition-all group"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap">
        Support
      </span>
    </Link>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = () => {
    if (!text.trim()) return;
    // Using Google Charts API for QR generation (can be replaced with a library)
    const encoded = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
    setQrUrl(url);
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Text/URL</TabsTrigger>
          <TabsTrigger value="wifi">WiFi</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text or URL</Label>
            <Input
              id="text-input"
              placeholder="Enter text or URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="wifi" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Network Name (SSID)</Label>
              <Input
                placeholder="WiFi Network Name"
                onChange={(e) => {
                  const ssid = e.target.value;
                  setText(`WIFI:S:${ssid};T:WPA;P:;;`);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="WiFi Password"
                onChange={(e) => {
                  const password = e.target.value;
                  // Simple WiFi QR format
                  setText((prev) => {
                    const match = prev.match(/WIFI:S:(.*?);/);
                    const ssid = match ? match[1] : "";
                    return `WIFI:S:${ssid};T:WPA;P:${password};;`;
                  });
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="John Doe"
                onChange={(e) => {
                  setText(`BEGIN:VCARD\nVERSION:3.0\nN:${e.target.value}\nEND:VCARD`);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="+1234567890"
                onChange={(e) => {
                  setText((prev) => {
                    if (prev.includes("TEL:")) {
                      return prev.replace(/TEL:.*\n/, `TEL:${e.target.value}\n`);
                    }
                    return prev.replace("END:VCARD", `TEL:${e.target.value}\nEND:VCARD`);
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="email@example.com"
                onChange={(e) => {
                  setText((prev) => {
                    if (prev.includes("EMAIL:")) {
                      return prev.replace(/EMAIL:.*\n/, `EMAIL:${e.target.value}\n`);
                    }
                    return prev.replace("END:VCARD", `EMAIL:${e.target.value}\nEND:VCARD`);
                  });
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={generateQR} disabled={!text.trim()}>
        Generate QR Code
      </Button>

      {qrUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-lg">
            <img src={qrUrl} alt="Generated QR Code" className="w-[300px] h-[300px]" />
          </div>
          <Button variant="outline" onClick={downloadQR}>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
        </div>
      )}
    </div>
  );
}

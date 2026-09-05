import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import BackButton from "../../components/ui/BackButton";

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nous contacter</h2>
          {sent ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">Votre message a été envoyé. Nous vous répondrons dans les meilleurs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              <Input label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
              <Button type="submit" isLoading={isLoading} className="w-full">Envoyer</Button>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>Plateforme :</strong> Mali Retrouvé</p>
            <p><strong>Email :</strong> contact@maliretrouve.ml</p>
            <p><strong>Téléphone :</strong> +223 20 00 00 00</p>
            <p><strong>Adresse :</strong> Bamako, Mali</p>
            <p><strong>DPO :</strong> dpo@maliretrouve.ml</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "./Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail("");
  }

  return (
    <section id="newsletter" className="bg-surface px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Get weekly tips straight to your inbox
          </h2>
          <p className="mt-4 max-w-md text-muted">
            A-Level strategies, spring week playbooks, fitness advice, and
            things I wish I&apos;d known earlier. Free, no spam, unsubscribe
            anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <Button type="submit" className="shrink-0">
            {submitted ? "Subscribed" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}

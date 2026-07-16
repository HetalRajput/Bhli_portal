"use client";

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This is the auto-generated boilerplate page for Settings. Edit this file in `src/app/admin/settings/page.tsx`.
        </p>
      </div>
    </div>
  );
}

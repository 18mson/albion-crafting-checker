"use client";

import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Globe, Zap, MapPin } from 'lucide-react';
import { SERVERS, type Server } from '../lib/albion-api';

interface ServerTabsProps {
  value: Server;
  onValueChange: (server: Server) => void;
}

const serverIcons = {
  'West': Globe,
  'East': Zap,
  'Europe': MapPin,
};

const serverLabels = {
  'West': 'Americas',
  'East': 'Asia',
  'Europe': 'Europe',
};

export function ServerTabs({ value, onValueChange }: ServerTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
        {SERVERS.map((server) => {
          const Icon = serverIcons[server];
          return (
            <TabsTrigger
              key={server}
              value={server}
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{serverLabels[server]}</span>
              <span className="sm:hidden">{server}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
interface DevBorderProps {
  componentName: string;
  children: preact.ComponentChildren;
}

export function DevBorder({ componentName, children }: DevBorderProps) {
  return (
    <div class="relative border border-red-500 p-1">
      {children}
      <span class="absolute bottom-0 right-0 text-xs text-red-500 bg-black px-1 opacity-60">
        {componentName}
      </span>
    </div>
  );
}

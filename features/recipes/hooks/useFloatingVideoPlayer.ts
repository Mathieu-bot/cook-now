"use client";

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent, RefObject } from 'react';

type UseFloatingVideoPlayerOptions = {
  initialFloating?: boolean;
};

type UseFloatingVideoPlayerResult = {
  isFloating: boolean;
  setFloating: (value: boolean) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  floatingStyle: CSSProperties;
  handleDragStart: (event: ReactMouseEvent<HTMLDivElement>) => void;
};

export function useFloatingVideoPlayer(
  options: UseFloatingVideoPlayerOptions = {},
): UseFloatingVideoPlayerResult {
  const { initialFloating = true } = options;

  const [isFloating, setIsFloating] = useState(initialFloating);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(event: MouseEvent) {
      setPosition(() => {
        const offset = dragOffsetRef.current;
        const x = event.clientX - offset.x;
        const y = event.clientY - offset.y;
        return { x, y };
      });
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (!position) {
      setPosition({ x: rect.left, y: rect.top });
    }

    setIsDragging(true);
  };

  const floatingStyle: CSSProperties = {};

  if (isFloating) {
    if (position) {
      floatingStyle.top = position.y;
      floatingStyle.left = position.x;
    } else {
      floatingStyle.bottom = 16;
      floatingStyle.right = 16;
    }
  }

  return {
    isFloating,
    setFloating: setIsFloating,
    containerRef,
    floatingStyle,
    handleDragStart,
  };
}

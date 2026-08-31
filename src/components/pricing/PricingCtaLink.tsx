"use client";

import type { ComponentProps, MouseEvent } from "react";

import { ButtonLink } from "@/components/ui/Button";
import type { PricingEventName } from "@/content/pricing";

type Props = ComponentProps<typeof ButtonLink> & {
  eventName: PricingEventName;
  offerId: string;
  placement: string;
};

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
};

export default function PricingCtaLink({
  eventName,
  offerId,
  placement,
  onClick,
  ...props
}: Props) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const payload = {
      event: eventName,
      offer_id: offerId,
      placement,
      destination: props.href,
    };
    const analyticsWindow = window as AnalyticsWindow;

    (analyticsWindow.dataLayer ??= []).push(payload);
    analyticsWindow.gtag?.("event", eventName, {
      offer_id: offerId,
      placement,
      destination: props.href,
    });
    onClick?.(event);
  }

  return <ButtonLink {...props} onClick={handleClick} />;
}

import { useEffect } from "react";
import { useLocation, useTransition } from "@remix-run/react";
import nProgress from "nprogress";

export default function useNProgress() {
  const location = useLocation();
  const transition = useTransition();

  const isLoading = transition.state !== "idle";
  const isSameRoute = location.pathname === transition?.location?.pathname;

  useEffect(() => {
    if (isLoading && !isSameRoute) {
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [isLoading, isSameRoute]);
}

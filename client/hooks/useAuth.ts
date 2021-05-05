import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

const allowedLinks = ["/circle", "/circle/[circleId]"];
function useAuth() {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (loading || data.me || allowedLinks.includes(router.pathname)) return;
    if (window.location.pathname !== "/login") {
      router.replace("/login?next=" + router.asPath);
    }
  }, [loading, data, router]);

  return { user: data?.me, userLoading: loading };
}

export default useAuth;

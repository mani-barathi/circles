import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

function useAuth() {
  const router = useRouter();
  const { data, loading } = useMeQuery({ fetchPolicy: "cache-and-network" });

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);

  return { user: data?.me, userLoading: loading };
}

export default useAuth;

import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, userLoading } = useAuth();

  if (!user || userLoading) return <h3>Loading...</h3>;

  return (
    <div>
      <h1>Circles</h1>
    </div>
  );
}

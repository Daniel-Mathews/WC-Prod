import Image from "next/image";

export default function Home() {
  return (
    <div>
      <a href="/auth/register" className="btn btn-primary">Register</a>
      <a href="/auth/login" className="btn btn-secondary">Login</a>
    </div>
  );
}

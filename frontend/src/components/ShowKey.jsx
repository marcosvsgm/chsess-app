// src/components/ShowKey.jsx
export default function ShowKey() {
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;

  console.log('Chave pública:', publicKey);

  return <div>Chave pública: {publicKey}</div>;
}

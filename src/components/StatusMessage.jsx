export default function StatusMessage({ error, success }) {
  if (!error && !success) return null;
  return (
    <p className={`text-sm mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>
      {error || success}
    </p>
  );
}

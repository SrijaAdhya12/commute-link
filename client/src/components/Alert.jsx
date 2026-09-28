export default function Alert({ type = "error", message, onClose }) {
	if (!message) return null

	const styles = type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"

	return (
		<div className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${styles}`}>
			<p>{message}</p>
			{onClose && (
				<button onClick={onClose} className="font-bold opacity-70 hover:opacity-100" aria-label="Close alert">
					×
				</button>
			)}
		</div>
	)
}

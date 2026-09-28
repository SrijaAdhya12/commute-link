export default function FormField({ label, error, children, required = false, hint }) {
	return (
		<label className="block">
			<span className="mb-1.5 block text-sm font-semibold text-slate-700">
				{label} {required && <span className="text-rose-500">*</span>}
			</span>
			{children}
			{hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
			{error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
		</label>
	)
}

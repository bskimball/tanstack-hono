const reportWebVitals = (onPerfEntry?: () => void) => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		void import("web-vitals").then(async ({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
			onCLS(onPerfEntry);
			await onINP(onPerfEntry);
			await onFCP(onPerfEntry);
			await onLCP(onPerfEntry);
			await onTTFB(onPerfEntry);
		});
	}
};

export default reportWebVitals;

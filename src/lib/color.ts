function luminance(hex: string): number {
	const channels = hex
		.slice(1)
		.match(/.{2}/g)
		?.map((value) => Number.parseInt(value, 16) / 255);
	if (channels?.length !== 3) throw new Error(`invalid hex color: ${hex}`);
	const [red, green, blue] = channels.map((value) =>
		value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function readableForeground(accent: string): "#000000" | "#ffffff" {
	return luminance(accent) > 0.179 ? "#000000" : "#ffffff";
}

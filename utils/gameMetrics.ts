export type CharState = "correct" | "incorrect" | "pending";

export function getCharacterStates(typed: string, target: string): CharState[] {
	return target.split("").map((char, index) => {
		if (index >= typed.length) return "pending";
		return typed[index] === char ? "correct" : "incorrect";
	});
}

export function calculateWPM(
	typed: string,
	target: string,
	elapsedSeconds: number,
): number {
	if (elapsedSeconds === 0) return 0;

	const typedWords = typed.split(" ");
	const targetWords = target.split(" ");

	const correctWords = typedWords.filter((word, index) => {
		return word === targetWords[index];
	}).length;

	return Math.round((correctWords / elapsedSeconds) * 60);
}

export function calculateAccuracy(
	correctKeystrokes: number,
	totalKeystrokes: number,
): number {
	if (totalKeystrokes === 0) return 1;
	return Math.round((correctKeystrokes / totalKeystrokes) * 100) / 100;
}

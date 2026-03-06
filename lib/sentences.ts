export const sentences = [
	"The quick brown fox jumps over the lazy dog",
	"A journey of a thousand miles begins with a single step",
	"To be or not to be that is the question",
	"All that glitters is not gold but it still catches the eye",
	"The only way to do great work is to love what you do",
	"In the middle of every difficulty lies opportunity",
	"It does not matter how slowly you go as long as you do not stop",
	"Success is not final failure is not fatal it is the courage to continue that counts",
	"The best time to plant a tree was twenty years ago the second best time is now",
	"You miss one hundred percent of the shots you do not take",
	"Whether you think you can or think you cannot you are right",
	"The future belongs to those who believe in the beauty of their dreams",
	"It is during our darkest moments that we must focus to see the light",
	"Believe you can and you are halfway there",
	"Do not watch the clock do what it does and keep going",
];

export function getRandomSentence(): string {
	return sentences[Math.floor(Math.random() * sentences.length)];
}

export const dateId = (minusDays = 0) => {
	const d = new Date();
	d.setDate(d.getDate()-minusDays);
	const date = d.getDate();
	const month = d.getMonth()+1;
	const year = d.getFullYear();
	return `${date}-${month}-${year}`;
};

export const hourNow = () => {
	const d = new Date();
	return d.getHours();
};

export const daysOld = (id, days) => {
	const [d2,m2,y2] = id.split('-');

	const d = new Date();
	const ago = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000));
	const then = new Date(y2, m2-1, d2, 0, 0, 0, 0);

	return then < ago;
};
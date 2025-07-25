import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo'
})
export class DaysAgoPipe implements PipeTransform {

  transform(value: unknown): string {
    const givenDate = new Date(value as string); // assuming input is a date string
    const today = new Date();

    const timeDiff = today.getTime() - givenDate.getTime(); // in milliseconds
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // convert to days

    if (isNaN(dayDiff)) return 'Invalid date';

    return dayDiff === 0 ? 'Today' : `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
  }

}

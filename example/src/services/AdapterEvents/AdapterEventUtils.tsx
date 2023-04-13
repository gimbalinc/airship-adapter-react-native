import type { RegionEvent } from 'rtn-gimbal-airship-adapter';
import type AdapterEvent from './AdapterEvent';

interface AdapterEventUtilsInterface {
  regionEventToAdapterEvent: (regionEvent: RegionEvent) => AdapterEvent;
}

const formattedTimestamp = () => {
  const now = new Date();
  const nowDay = now.getDate();
  const nowDayString = nowDay < 10 ? '0' + nowDay : '' + nowDay;
  const nowMonth = now.getMonth() + 1;
  const nowMonthString = nowMonth < 10 ? '0' + nowMonth : '' + nowMonth;
  const nowHoursAndMinutes = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${nowMonthString} - ${nowDayString} ${nowHoursAndMinutes}`;
};

const AdapterEventUtils: AdapterEventUtilsInterface = {
  regionEventToAdapterEvent: (regionEvent) => {
    const descriptionPrefix = regionEvent.departureTime
      ? 'exit - '
      : 'entry - ';

    const nowTimestamp = formattedTimestamp();
    const descriptionSuffix = `${regionEvent.place.name} ${nowTimestamp}`;

    return {
      description: `${descriptionPrefix} ${descriptionSuffix}`,
      regionEvent: JSON.stringify(regionEvent),
    };
  },
};

export default AdapterEventUtils;

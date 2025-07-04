import { env } from "../plugin/env.plugin";

interface DateOptions {
    date: string | Date | number;
}

export const getDate = (option?: DateOptions) => {
    const timeZone = env.TIME_ZONE;

    let fecha = new Date();
    if (option !== undefined) {
        fecha = typeof option.date === 'number' ? new Date(option.date.toString().length === 10 ? option.date * 1000 : option.date) : new Date(option.date);
    }

    const options: Intl.DateTimeFormatOptions = {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('es-MX', options);
    const parts = formatter.formatToParts(fecha);

    const get = (type: string) => parts.find(p => p.type === type)?.value.padStart(2, '0');

    const año = get('year');
    const mes = get('month');
    const día = get('day');
    const hora = get('hour');
    const minuto = get('minute');
    const segundo = get('second');

    // Para calcular el offset respecto a UTC en minutos
    const dateUTC = new Date(fecha.toLocaleString('en-US', { timeZone }));
    const offsetMin = (dateUTC.getTime() - fecha.getTime()) / 60000;
    const offsetHoras = Math.floor(offsetMin / 60);
    const offsetString = `GMT${offsetHoras >= 0 ? '+' : ''}${offsetHoras}`;

    return {
        iso: `${año}-${mes}-${día}T${hora}:${minuto}:${segundo}`,
        separado: {
            date: `${día}/${mes}/${año}`,
            hour: `${hora}:${minuto}:${segundo}`,
        },
        zone: {
            timeZone,
            gmtOffset: offsetString,
        }
    };
}

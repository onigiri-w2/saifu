import * as Localization from 'expo-localization';

export const locale = Localization.getLocales()[0].languageCode || 'en';
export const currency = Localization.getLocales()[0].currencyCode || 'USD';

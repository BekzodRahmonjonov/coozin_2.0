import en from './en.json';
import ru from './ru.json';
import uz from './uz.json';
export const i18n = {
  locales: [
    {
      code: 'en',
      name: 'Eng',
      iso: 'en'
    },
    {
      code: 'ru',
      name: 'Рус',
      iso: 'ru'
    },
    {
      code: 'uz',
      name: 'Uz',
      iso: 'uz'
    }
  ],
  defaultLocale: "uz",
  vueI18n: {
    fallbackLocale: "en",
    messages: {en,ru,uz},
  },
};

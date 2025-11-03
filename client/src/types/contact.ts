export interface ContactData {
  email: string;
  address: {
    az: string;
    en: string;
  };
  address2: {
    az: string;
    en: string;
  };
  whatsapp: string;
  phone: string;
  workingHours: {
    az: {
      weekdays: string;
      sunday: string;
    };
    en: {
      weekdays: string;
      sunday: string;
    };
  };
}

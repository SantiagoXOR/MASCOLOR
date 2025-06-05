export type HeroContent = {
  headline: string;
  subheadline: string;
  productTitle: string;
  backgroundImageUrl: string;
  productImageUrl: string;
  logoUrl: string;
  productBrandLogoUrl: string;
  phone: string;
  advisor: {
    name: string;
    role: string;
    iconUrl: string;
  };
  benefitItems: {
    title: string;
    subtitle: string;
    icon: string;
  }[];
};

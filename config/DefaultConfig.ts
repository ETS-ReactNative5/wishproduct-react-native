import { ThemeKey } from "./themes";
import { LanguageKey } from "./languages";

export interface AppTheme {
  backgroundColor: string,
  highlightColor: string,
  highlightTextColor: string,
  buyButtonLink: string,
  textColor: string,
  lightTextColor: string,
  lightBottomColor: string,
  alternateMessageBackgroundColor: string,
  labelBgColor: string,
  activeColor: string,
  dangerColor: string,
  appColor: string,
  facebookColor: string,
  googleColor: string,
  inputColor: string,
  inputBorderColor: string,
}

export interface HomePageType {
  productLabel: string,
  labelViewAll: string,
  labelFashion: string,
  labelSave: string,
  labelHotTrend: string,
  labeBestSell: string,
  labeBrandLogo: string,
}

export interface advertisementType {
    label1: string,
    label2: string,
    labelBuy: string,
}

export interface AppConstants {
    selectedTheme: ThemeKey,
    selectedLanguage: LanguageKey,
    title: string,
    recraftLogo: string,
    homePage: HomePageType,
    advertisement: advertisementType,
}

export interface ApplicationConfig {
    constants?: AppConstants
    API_URL: string
    IMG_DEFAULT: string
}

// @ts-ignore
const Logo = require("../images/recraftshoping-app-logo2.png")

export const defaultConfig: ApplicationConfig = {
    API_URL: 'https://api.giathucpham.com',
    IMG_DEFAULT: 'https://via.placeholder.com/360x459.png',
    constants: {
      selectedTheme: ThemeKey.light,
      selectedLanguage: LanguageKey.en,
      title: "RecraftShoppify",
      recraftLogo: Logo,
      homePage: {
        productLabel: "NEW",
        labelViewAll: "View All",
        labelFashion: "FASHION",
        labelSave: "SALE",
        labelHotTrend: "Sản phẩm trend",
        labeBestSell: "Sản phẩm bestsell",
        labeBrandLogo: "Thương hiệu hàng đầu Việt Nam",
      },
      advertisement: {
        label1: "SHOP",
        label2: "NOW",
        labelBuy: "BUY",
      },
    },
}

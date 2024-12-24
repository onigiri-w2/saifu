import { createContext, useContext } from 'react';

import { InfoVarinat } from '../types';

type InfoVariantContextValue = InfoVarinat;
export const InfoVariantContext = createContext({} as InfoVariantContextValue);
export const useInfoVariantContext = () => useContext(InfoVariantContext);

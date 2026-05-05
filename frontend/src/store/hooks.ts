import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook tipado para useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook tipado para useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;

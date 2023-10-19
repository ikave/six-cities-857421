import { useCallback, useEffect } from 'react';

import type { CityName } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setCity } from '../../store/site-process/site-process';
import City from '../city/city';
import { getCities, getCity } from '../../store/site-process/selectors';
import { fetchOffers } from '../../store/action';

const CitiesList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(getCities);
  const activeCity = useAppSelector(getCity);

  const handleCityClick = useCallback(
    (name: CityName) => {
      dispatch(setCity(name));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchOffers(activeCity.name));
  }, [dispatch, activeCity.name]);

  return (
    <ul className="locations__list tabs__list">
      {cities.map(({ name }) => (
        <City
          key={name}
          name={name}
          isActive={name === activeCity.name}
          onClick={handleCityClick}
        />
      ))}
    </ul>
  );
};

export default CitiesList;

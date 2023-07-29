// import { useRouter } from 'next/router';
import React, { useCallback, useReducer, useState } from 'react';

const LanguageSetsContext = React.createContext({});

export default LanguageSetsContext;

function languageSetsReducer(state, action) {
  switch (action.type) {
    case 'addLanguageSet': {
      const newLanguageSet = [...state];
      action.languageSet.forEach((set) => {
        const exists = newLanguageSet.find((ls) => ls._id === set._id);
        if (!exists) {
            newLanguageSet.push(set);
        }
      });
      return newLanguageSet;
    }
    case 'deletePost': {
      const newLanguageSet = [];
      state.forEach((languageSet) => {
        if (languageSet._id !== action.languageSetId) {
            newLanguageSet.push(post);
        }
      });
      return newLanguageSet;
    }
    default:
      return state;
  }
}

export const LanguageSetsProvider = ({ children }) => {
  const [languageSets, dispatch] = useReducer(languageSetsReducer, []);
  const [noMoreLanguageSets, setNoMoreLanguageSets] = useState(false);

  const deleteLanguageSet = useCallback((languageSetId) => {
    dispatch({
      type: 'deleteLanguageSet',
      languageSetId,
    });
  }, []);

  const setLanguageSetsFromSSR = useCallback((languageSetsFromSSR = []) => {
    dispatch({
      type: 'addLanguageSets',
      languageSets: languageSetsFromSSR,
    });
  }, []);

  const getLanguageSets = useCallback(
    async ({ lastLanguageSetDate, getNewerLanguageSets = false }) => {
      const result = await fetch(`/api/getLanguageSets`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ lastLanguageSetDate, getNewerLanguageSets }),
      });
      const json = await result.json();
      console.log({json}, 'pqr')
      const languageSetsResult = json.languageSets || [];
      if (languageSetsResult.length < 5) {
        setNoMoreLanguageSets(true);
      }
      dispatch({
        type: 'addLanguageSets',
        languageSets: languageSetsResult,
      });
    },
    []
  );

  return (
    <LanguageSetsContext.Provider
      value={{ languageSets, setLanguageSetsFromSSR, getLanguageSets, noMoreLanguageSets, deleteLanguageSet }}
    >
      {children}
    </LanguageSetsContext.Provider>
  );
};
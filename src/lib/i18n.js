import React, { Component } from "react";
import { Location } from '@reach/router';
import translations from '../lib/translations.json';

const withI18N = WrappedComponent => {
  class WithI18N extends Component {
    getT = (location) => {
      const language = location.search.slice(1); // query like "?en" or "?fr"
      let t = (key, options) => {
        if (key === "current-language-code") {
          return language === "fr" ? "fr" : "en";
        }
        if (key === "other-language-code") {
          return language === "fr" ? "en" : "fr";
        }
        if (Object.keys(translations).indexOf(key) > -1) {
          let trans =
            translations[key][
              language === "fr" ? "fr" : "en"
            ];
          if (options) {
            trans = trans.replace("{{x}}", options.x);
          }
          return trans;
        }
        return key;
      }
      return t;
    };

    getChangeLanguage = (location) => {
      const language = location.search.slice(1); // query like "?en" or "?fr"
      const otherLanguage = language === "en" ? "fr" : "en";
      const changeLanguage = () => {
        location.search = "?" + otherLanguage;
      };
      return changeLanguage;
    }

    render() {
      return (
        <Location>
        {({ location })=>
          <WrappedComponent
            {...this.props}
            t={this.getT(location)}
            changeLanguage={this.getChangeLanguage(location)}
            />
          }
        </Location>
        );

    }
  }
  return WithI18N;
};

export default withI18N;

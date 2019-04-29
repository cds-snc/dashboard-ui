import React, { Component } from "react";
import { Location } from '@reach/router';
import translations from '../lib/translations.json';
let translationDict = {};

const withI18N = WrappedComponent => {
  class WithI18N extends Component {
    getT = (location) => {
      const language = location.search.slice(1); // query like "?en" or "?fr"
      let t = (key, options) => {
        if (Object.keys(translations).indexOf(key) > -1) {
          let trans =
            translations[key][
              language === "en" ? "en" : "fr"
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

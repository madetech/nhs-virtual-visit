import React, { useEffect } from "react";
import "./styles.scss";
import Head from "next/head";
import NavigationBarForUserType from "../NavigationBarForUserType";
import HeaderLink from "../HeaderLink";
import MenuToggle from "../../../node_modules/nhsuk-frontend/packages/components/header/menuToggle";
import Logo from "../Logo";

const Layout = ({
  title,
  hasErrors,
  children,
  backLink,
  mainStyleOverride,
  isBookService = true,
  showNavigationBarForType,
  showNavigationBar = false,
}) => {
  useEffect(() => {
    MenuToggle();
    return () => {};
  }, []);

  return (
    <>
      <Head>
        <title>
          {hasErrors ? "Error: " : ""} {title} |{" "}
          {isBookService ? "Book" : "Attend"} a virtual visit
        </title>
      </Head>
      <a className="nhsuk-skip-link" href="#maincontent">
        Skip to main content
      </a>
      <header className="nhsuk-header" role="banner">
        <div className="nhsuk-width-container nhsuk-header__container">
          <div className="nhsuk-header__logo nhsuk-header__logo--only">
            <HeaderLink enabled={!!showNavigationBarForType}>
              <Logo />
            </HeaderLink>
          </div>

          <div className="nhsuk-header__content" id="content-header">
            <div className="nhsuk-header__menu">
              {showNavigationBar && showNavigationBarForType && (
                <button
                  className="nhsuk-header__menu-toggle"
                  id="toggle-menu"
                  aria-controls="header-navigation"
                  aria-label="Open menu"
                  data-testid="navbar-menu-button"
                >
                  Menu
                </button>
              )}
            </div>
          </div>
        </div>
        {showNavigationBar && (
          <NavigationBarForUserType userType={showNavigationBarForType} />
        )}
      </header>
      <div className="nhsuk-width-container">
        <main
          className="nhsuk-main-wrapper"
          id="maincontent"
          style={mainStyleOverride ? { paddingTop: "0" } : {}}
        >
          {children}
          {backLink}
        </main>
      </div>
    </>
  );
};

export default Layout;

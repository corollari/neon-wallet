// @flow
import React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import Logout from './Logout'
import styles from './Sidebar.scss'
import HomeIcon from '../../../assets/navigation/home.svg'
import HistoryIcon from '../../../assets/navigation/history.svg'
import SendIcon from '../../../assets/navigation/send.svg'
import ReceiveIcon from '../../../assets/navigation/receive.svg'
import ContactsIcon from '../../../assets/navigation/contacts.svg'
import TokenSaleIcon from '../../../assets/navigation/tokens.svg'
import SettingsIcon from '../../../assets/navigation/settings.svg'
import NewsIcon from '../../../assets/navigation/news.svg'
import { ROUTES } from '../../../core/constants'

import LightLogoWithoutText from '../../../assets/images/logo-without-text-black.png'
import DarkLogoWithoutText from '../../../assets/images/logo-without-text.png'

type Props = {
  className: string,
  theme: ThemeType,
  pendingTransactionsCount: number,
  isWatchOnly?: boolean,
}

const Sidebar = ({
  className,
  theme,
  pendingTransactionsCount,
  isWatchOnly,
}: Props) => {
  const themeBasedLogo =
    theme === 'Light' ? LightLogoWithoutText : DarkLogoWithoutText

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.group}>
        <div className={styles.logo}>
          <img src={themeBasedLogo} alt="neon-logo" />
        </div>

        <NavLink
          id="dashboard"
          exact
          to={ROUTES.DASHBOARD}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          <HomeIcon />
          <div> Wallet </div>
        </NavLink>

        <NavLink
          id="history"
          exact
          to={ROUTES.TRANSACTION_HISTORY}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          {pendingTransactionsCount > 0 && (
            <div className={styles.pendingTransactionsCount}>
              {pendingTransactionsCount}
            </div>
          )}
          <HistoryIcon />
          <div> Activity </div>
        </NavLink>

        <NavLink
          id="send"
          exact
          to={ROUTES.SEND}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          <SendIcon />
          <div> Send </div>
        </NavLink>

        <NavLink
          id="receive"
          exact
          to={ROUTES.RECEIVE}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          <ReceiveIcon />
          <div> Receive </div>
        </NavLink>

        <NavLink
          id="contacts"
          to={ROUTES.CONTACTS}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          <ContactsIcon />
          <div> Contacts </div>
        </NavLink>

        {!isWatchOnly && (
          <NavLink
            id="tokensale"
            to={ROUTES.TOKEN_SALE}
            className={styles.navItem}
            activeClassName={styles.active}
          >
            <TokenSaleIcon />
            <div> Token Sale </div>
          </NavLink>
        )}
        <NavLink
          id="News"
          to={ROUTES.NEWS}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          <NewsIcon />
          <div> News </div>
        </NavLink>

        <NavLink
          id="settings"
          to={ROUTES.SETTINGS}
          className={styles.navItem}
          activeClassName={styles.active}
        >
          <SettingsIcon />
          <div> Settings </div>
        </NavLink>
      </div>

      <Logout
        className={classNames(
          styles.group,
          styles.logoutToolTipGroup,
          styles.navItem,
        )}
        id="logout"
      />
    </div>
  )
}

export default Sidebar

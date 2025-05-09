import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import classNames from "classnames";
import logo from "@/assets/images/logo-sm.png";

/**
 * Renders the application menu
 */

const IconMenu = ({
  menuItems,
  toggleMenu,
  activeMenuItems
}) => {
  const onMenuItemClick = (e, menuItem) => {
    const hasChildren = menuItem.children && menuItem.children.length;
    if (hasChildren) {
      e.preventDefault();
    }
    toggleMenu(menuItem, true);
  };
  return <>
            <div className="sidebar-icon-menu">
                <div className="logo-box">
                    <Link to="/">
                        <img src={logo} alt="small logo" height="28" />
                    </Link>
                </div>
                <SimpleBar className="h-100">
                    <ul className="menu" id="two-col-sidenav-main">
                        {(menuItems || []).map((item, index) => {
            const activeParent = activeMenuItems && activeMenuItems.length && activeMenuItems[activeMenuItems.length - 1] === item["key"];
            return <li key={index} className="menu-item nav-link-ref">
                                    <Link className={classNames("menu-link nav-link-ref", {
                active: activeParent
              })} to={item.children ? "/#" : item.url} data-bs-title={item.label} data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-menu-key={item.key} onClick={e => {
                onMenuItemClick(e, item);
              }}>
                                        {item.icon && <span className="menu-icon"><item.icon /></span>}
                                    </Link>
                                </li>;
          })}
                    </ul>
                </SimpleBar>
            </div>
        </>;
};
export default IconMenu;
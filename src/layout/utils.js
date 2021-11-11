export const combinePaths = (parent, child) =>
  `${parent?.replace(/\/$/, '')}/${child?.replace(/^\//, '')}`;
// route burt path-g ugsarch bn
export const buildPaths = (routes, parentPath = '') =>
  routes.map(route => {
    const path = combinePaths(parentPath, route.url);
    return {
      ...route,
      path,
      ...(route.menus && { menus: buildPaths(route.menus, path) }),
    };
  });

export const setupParents = (routes, parentRoute = null) =>
  routes.map(route => {
    const withParent = {
      ...route,
      ...(parentRoute && { parent: parentRoute }),
    };
    return {
      ...withParent,
      ...(withParent.menus && {
        menus: setupParents(withParent.menus, withParent),
      }),
    };
  });

// flat array bolgoh / child parentgui, neg tuvshind bolgoh
export const flattenRoutes = routes =>
  routes
    .map(route => [route.menus ? flattenRoutes(route.menus) : [], route])
    .flat(Infinity);

export const generateRoutes = routes =>
  flattenRoutes(setupParents(buildPaths(routes)));

// tuhain route-n  buh parentuud- breadcurp
export const getParents = route => {
  if (!route.parent) {
    return [route];
  }

  return [...getParents(route.parent), route];
};

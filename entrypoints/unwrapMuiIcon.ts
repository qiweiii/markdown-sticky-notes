const unwrapMuiIcon = <T,>(icon: T): T => {
  if (icon && typeof icon === "object" && "default" in icon) {
    return (icon as { default: T }).default;
  }

  return icon;
};

export default unwrapMuiIcon;

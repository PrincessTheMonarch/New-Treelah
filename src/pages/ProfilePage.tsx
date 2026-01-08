import { useState, CSSProperties, FormEvent, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  Heart,
  Headset,
  User,
  ChevronDown,
  Sparkles,
  UserCircle,
  Package,
  Eye,
  Settings,
  LogOut,
  Pencil,
  Eye as EyeIcon,
  Trash2,
  EyeOff,
} from "lucide-react";

export function ProfilePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phoneNumber: "+234 8123456789",
  });
  const originalData = useRef(formData);

  // Header styles from CartPage/BulkOrderPage
  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E7EB',
    width: '100%',
    padding: '12px 16px',
  };

  const headerContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerLeftStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const logoCircleStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const brandStackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const brandNameStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1A1A1A',
    lineHeight: '1.2',
  };

  const brandTaglineStyle: CSSProperties = {
    fontSize: '11px',
    color: '#6B7280',
    lineHeight: '1.2',
  };

  const navLinksStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const navLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1A1A1A',
    cursor: 'pointer',
    padding: '8px 0',
  };

  const shoppingAssistantButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  const headerCenterStyle: CSSProperties = {
    flex: 1,
    maxWidth: '400px',
    marginLeft: '20px',
    marginRight: '20px',
  };

  const searchBarContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '8px 36px 8px 14px',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F6F6F6',
    fontSize: '13px',
    outline: 'none',
  };

  const searchIconStyle: CSSProperties = {
    position: 'absolute',
    right: '12px',
    color: '#6B7280',
    cursor: 'pointer',
  };

  const headerRightStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const iconButtonStyle: CSSProperties = {
    cursor: 'pointer',
    color: '#1A1A1A',
  };

  // Mega Menu styles
  const megaMenuContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '70%',
    transform: 'translateX(-30%)',
    width: '480px',
    backgroundColor: '#FBFBFB',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginTop: '8px',
    zIndex: 100,
    display: categoriesOpen ? 'flex' : 'none',
    gap: '12px',
  };

  const megaMenuColumnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '6px 12px',
    alignItems: 'flex-start',
  };

  const megaMenuHeaderStyle: CSSProperties = {
    width: '100%',
    fontSize: '12px',
    fontWeight: 500,
    color: '#717182',
    marginBottom: '4px',
  };

  const megaMenuLinkStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#1A1A1A',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  };

  const megaMenuColumns = [
    {
      header: "By Occasion",
      links: ["Birthdays", "Weddings", "Anniversaries", "Baby Showers", "Graduations"],
    },
    {
      header: "By Recipient",
      links: ["For Him", "For Her", "For Kids", "For Teens", "For Colleagues", "For Couples"],
    },
    {
      header: "By Age",
      links: ["Babies", "Toddlers", "Children", "Teens", "Adults", "Seniors"],
    },
    {
      header: "By Type",
      links: ["Toys & Games", "Home & Living", "Beauty & Wellness", "Fashion & Accessories", "Tech & Gadgets", "Food & Beverages"],
    },
  ];

  // Handle search submission
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery.trim());
      navigate(`/products?${params.toString()}`);
    }
  };

  // Handle mega menu link click
  const handleMegaMenuClick = (link: string) => {
    const params = new URLSearchParams();
    params.set("search", link);
    navigate(`/products?${params.toString()}`);
    setCategoriesOpen(false);
  };

  // Main content styles
  const pageContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainContentStyle: CSSProperties = {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  };

  const pageTitleStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '32px',
  };

  // Sidebar styles
  const sidebarContainerStyle: CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 24px',
    display: 'flex',
    gap: '24px',
  };

  const sidebarStyle: CSSProperties = {
    width: '248px',
    minHeight: '717px',
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: 'fit-content',
  };

  const sidebarMenuItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  };

  const activeMenuItemStyle: CSSProperties = {
    ...sidebarMenuItemStyle,
    backgroundColor: 'transparent',
    color: '#FF8C42',
  };

  const inactiveMenuItemStyle: CSSProperties = {
    ...sidebarMenuItemStyle,
    color: '#6B7280',
    backgroundColor: 'transparent',
  };

  const logoutItemStyle: CSSProperties = {
    ...sidebarMenuItemStyle,
    color: '#DC2626',
    marginTop: 'auto',
  };

  // Content area styles
  const contentAreaStyle: CSSProperties = {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
  };

  // Personal Information Section
  const sectionStyle: CSSProperties = {
    marginBottom: '24px',
  };

  const sectionHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  };

  const sectionTitleStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const editLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#FF8C42',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  };

  const dataGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  };

  const dataItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const dataLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
  };

  const dataValueBoxStyle: CSSProperties = {
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
    padding: '12px 16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const dataValueStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
  };

  const dataInputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #FF8C42',
    backgroundColor: '#F6F6F6',
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#1A1A1A',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'text',
  };

  const dividerStyle: CSSProperties = {
    borderTop: '2px solid #E5E7EB',
    margin: '32px 0',
  };

  // Account Security Section
  const passwordSectionTitleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '24px',
  };

  const changePasswordLinkStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '160%',
    letterSpacing: '0%',
    color: '#717182',
    cursor: 'pointer',
    textDecoration: 'none',
    marginBottom: '16px',
    display: 'inline-block',
  };

  const passwordRowStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  };

  const passwordFieldStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const passwordFieldWithMarginStyle: CSSProperties = {
    ...passwordFieldStyle,
    marginBottom: '16px',
  };

  const passwordLabelStyle: CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '120%',
    letterSpacing: '0%',
    color: '#0A0A0A',
  };

  const passwordInputContainerStyle: CSSProperties = {
    position: 'relative',
  };

  const passwordInputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 40px 12px 16px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#FAFAFA',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const passwordToggleStyle: CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#6B7280',
    background: 'none',
    border: 'none',
    padding: '4px',
  };

  // Danger Zone
  const dangerZoneStyle: CSSProperties = {
    border: '1px solid #FEE2E2',
    backgroundColor: '#FEF2F2',
    borderRadius: '16px',
    padding: '24px',
    marginTop: '24px',
  };

  const dangerTitleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#DC2626',
    marginBottom: '8px',
  };

  const dangerDescriptionStyle: CSSProperties = {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '16px',
  };

  const deleteButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #DC2626',
    backgroundColor: 'transparent',
    color: '#DC2626',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setHasChanges(false);
    originalData.current = { ...formData };
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setHasChanges(false);
    toast.success("Profile updated successfully");
  };

  const handleCancelClick = () => {
    setFormData({ ...originalData.current });
    setIsEditing(false);
    setHasChanges(false);
  };

  useEffect(() => {
    if (isEditing) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.profile-input');
      if (inputs.length > 0) {
        inputs[0].focus();
      }
    }
  }, [isEditing]);

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out successfully");
    navigate("/");
  };

  const PasswordToggle = ({ show, onClick }: { show: boolean; onClick: () => void }) => (
    <button
      style={passwordToggleStyle}
      onClick={onClick}
      type="button"
    >
      {show ? (
        <div style={{ position: 'relative' }}>
          <EyeIcon size={18} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            backgroundColor: '#6B7280',
            transform: 'translateY(-50%) rotate(-45deg)',
          }} />
        </div>
      ) : (
        <EyeIcon size={18} />
      )}
    </button>
  );

  return (
    <div style={pageContainerStyle}>
      {/* Header from CartPage/BulkOrderPage */}
      <header style={headerStyle}>
        <div style={headerContainerStyle}>
          {/* Left: Logo + Brand Name + Tagline */}
          <div style={headerLeftStyle}>
            <div style={logoCircleStyle}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>Logo</span>
            </div>
            <div style={brandStackStyle}>
              <span style={brandNameStyle}>Treelah</span>
              <span style={brandTaglineStyle}>Tag line</span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div style={navLinksStyle}>
            {/* Categories with Mega Menu */}
            <div style={{ position: 'relative' }}>
              <div
                style={navLinkStyle}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories
                <ChevronDown size={14} style={{
                  transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} />
              </div>
              {/* Mega Menu Dropdown */}
              <div style={megaMenuContainerStyle}>
                {megaMenuColumns.map((column, colIndex) => (
                  <div key={colIndex} style={megaMenuColumnStyle}>
                    <span style={megaMenuHeaderStyle}>{column.header}</span>
                    {column.links.map((link, linkIndex) => (
                      <span
                        key={linkIndex}
                        style={megaMenuLinkStyle}
                        onClick={() => handleMegaMenuClick(link)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                          e.currentTarget.style.color = '#FF8C42';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                          e.currentTarget.style.color = '#1A1A1A';
                        }}
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Link to="/bulk-orders" style={{ ...navLinkStyle, textDecoration: 'none' }}>
              Souvenirs & Bulk Orders
            </Link>
            <button style={shoppingAssistantButtonStyle}>
              <Sparkles size={14} />
              Shopping Assistant
            </button>
          </div>

          {/* Right: Search Bar + Utility Icons */}
          <div style={headerRightStyle}>
            <div style={headerCenterStyle}>
              <form onSubmit={handleSearchSubmit}>
                <div style={searchBarContainerStyle}>
                  <input
                    type="text"
                    placeholder="Search for the perfect gift"
                    style={searchInputStyle}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div style={searchIconStyle}>
                    <Search size={16} />
                  </div>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/cart" style={iconButtonStyle}>
                <ShoppingCart size={20} />
              </Link>
              <div style={iconButtonStyle}>
                <Heart size={20} />
              </div>
              <div style={iconButtonStyle}>
                <Headset size={20} />
              </div>
              <div style={{ ...iconButtonStyle, color: '#FF8C42' }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <h1 style={pageTitleStyle}>Account Profile</h1>

        {/* Sidebar and Content Container */}
        <div style={sidebarContainerStyle}>
          {/* Side Navigation Menu - Left Column */}
          <aside style={sidebarStyle}>
            {/* Profile Info - Active */}
            <div style={activeMenuItemStyle}>
              <UserCircle size={20} />
              <span>Profile Info</span>
            </div>

            {/* Order History */}
            <div style={inactiveMenuItemStyle}>
              <Package size={20} />
              <span>Order History</span>
            </div>

            {/* Recently Viewed Items */}
            <div style={inactiveMenuItemStyle}>
              <Eye size={20} />
              <span>Recently viewed Items</span>
            </div>

            {/* Account Settings */}
            <div style={inactiveMenuItemStyle}>
              <Settings size={20} />
              <span>Account Setting</span>
            </div>

            {/* Spacer to push logout to bottom */}
            <div style={{ flex: 1 }} />

            {/* Logout */}
            <div style={logoutItemStyle} onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </aside>

          {/* Right Content Area */}
          <div style={contentAreaStyle}>
            {/* Personal Information Section */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Personal Information</h2>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      style={{ ...editLinkStyle, color: '#6B7280' }}
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                    <button
                      style={{ ...editLinkStyle, color: hasChanges ? '#FF8C42' : '#9CA3AF' }}
                      onClick={handleSaveClick}
                      disabled={!hasChanges}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button style={editLinkStyle} onClick={handleEditClick}>
                    <Pencil size={16} />
                    Edit
                  </button>
                )}
              </div>

              <div style={dataGridStyle}>
                <div style={dataItemStyle}>
                  <span style={dataLabelStyle}>Full Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="profile-input"
                      style={dataInputStyle}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  ) : (
                    <div style={dataValueBoxStyle}>
                      <span style={dataValueStyle}>{formData.fullName}</span>
                    </div>
                  )}
                </div>
                <div style={dataItemStyle}>
                  <span style={dataLabelStyle}>Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      className="profile-input"
                      style={dataInputStyle}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div style={dataValueBoxStyle}>
                      <span style={dataValueStyle}>{formData.email}</span>
                    </div>
                  )}
                </div>
                <div style={dataItemStyle}>
                  <span style={dataLabelStyle}>Phone Number</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="profile-input"
                      style={dataInputStyle}
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  ) : (
                    <div style={dataValueBoxStyle}>
                      <span style={dataValueStyle}>{formData.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={dividerStyle}></div>

            {/* Account Security Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Account Security</h2>
              <span
                style={changePasswordLinkStyle}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Change Password
              </span>

              {/* Current Password */}
              <div style={passwordFieldWithMarginStyle}>
                <label style={passwordLabelStyle}>Password</label>
                <div style={passwordInputContainerStyle}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter password"
                    style={passwordInputStyle}
                  />
                  <PasswordToggle show={showCurrentPassword} onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                </div>
              </div>

              {/* New Password Row */}
              <div style={passwordRowStyle}>
                <div style={passwordFieldStyle}>
                  <label style={passwordLabelStyle}>New Password</label>
                  <div style={passwordInputContainerStyle}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      style={passwordInputStyle}
                    />
                    <PasswordToggle show={showNewPassword} onClick={() => setShowNewPassword(!showNewPassword)} />
                  </div>
                </div>
                <div style={passwordFieldStyle}>
                  <label style={passwordLabelStyle}>Confirm Password</label>
                  <div style={passwordInputContainerStyle}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      style={passwordInputStyle}
                    />
                    <PasswordToggle show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={dangerZoneStyle}>
              <h3 style={dangerTitleStyle}>Danger Zone</h3>
              <p style={dangerDescriptionStyle}>
                Deleting your account is not reversible and all data including order history will be erased
              </p>
              <button style={deleteButtonStyle}>
                <Trash2 size={18} />
                I understand, delete my account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProfilePage;

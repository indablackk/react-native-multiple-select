import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  UIManager,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import reject from 'lodash/reject';
import find from 'lodash/find';
import get from 'lodash/get';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles, { colorPack } from './styles';

// set UIManager LayoutAnimationEnabledExperimental
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default class MultiSelect extends Component {
  static propTypes = {
    single: PropTypes.bool,
    selectedItems: PropTypes.array,
    items: PropTypes.array.isRequired,
    uniqueKey: PropTypes.string,
    tagBorderColor: PropTypes.string,
    tagTextColor: PropTypes.string,
    fontFamily: PropTypes.string,
    tagRemoveIconColor: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    selectedItemFontFamily: PropTypes.string,
    selectedItemTextColor: PropTypes.string,
    itemFontFamily: PropTypes.string,
    itemTextColor: PropTypes.string,
    itemFontSize: PropTypes.number,
    selectedItemIconColor: PropTypes.string,
    searchInputPlaceholderText: PropTypes.string,
    searchInputStyle: PropTypes.object,
    selectText: PropTypes.string,
    styleDropdownMenu: ViewPropTypes.style,
    styleDropdownMenuSubsection: ViewPropTypes.style,
    styleInputGroup: ViewPropTypes.style,
    styleItemsContainer: ViewPropTypes.style,
    styleMainWrapper: ViewPropTypes.style,
    styleRowList: ViewPropTypes.style,
    altFontFamily: PropTypes.string,
    hideSubmitButton: PropTypes.bool,
    hideDropdown: PropTypes.bool,
    submitButtonColor: PropTypes.string,
    submitButtonText: PropTypes.string,
    textColor: PropTypes.string,
    fontSize: PropTypes.number,
    fixedHeight: PropTypes.bool,
    hideTags: PropTypes.bool,
    canAddItems: PropTypes.bool,
    onAddItem: PropTypes.func,
    onChangeInput: PropTypes.func,
    displayKey: PropTypes.string,
    textInputProps: PropTypes.object,
    flatListProps: PropTypes.object,
    disableSearch: PropTypes.bool,
    noItemText: PropTypes.string,
    inputIconName: PropTypes.string,
    downIconName: PropTypes.string,
    dropdownMenuIconNameWhenHided: PropTypes.string,
    dropdownMenuIconNameWhenOpened: PropTypes.string,
    arrowLeftIconName: PropTypes.string,
    styleIfItemDisabled: ViewPropTypes.style,
    mainItemStyle: ViewPropTypes.style,
    mainSelectedItemStyle: Text.propTypes.style,
    styleRowListInner: ViewPropTypes.style,
    selectedItemRowIconStyle: ViewPropTypes.style,
    noItemRowStyle: ViewPropTypes.style,
    noItemRowTextStyle: Text.propTypes.style,
    itemsListWrapperStyle: ViewPropTypes.style,
    selectorViewStyle: ViewPropTypes.style,
    inputIconStyle: Text.propTypes.style,
    downIconStyle: Text.propTypes.style,
    arrowLeftIconStyle: Text.propTypes.style,
    styleItemsContainerWrapper: ViewPropTypes.style,
    submitButtonStyle: ViewPropTypes.style,
    submitButtonTextStyle: Text.propTypes.style,
    styleDropdownMenuWrapper: ViewPropTypes.style,
    dropdownMenuTouchableStyle: ViewPropTypes.style,
    dropdownMenuInTouchableViewStyle: ViewPropTypes.style,
    dropdownMenuTextStyle: Text.propTypes.style,
    dropdownMenuIconStyle: Text.propTypes.style,
    styleRowListSelected: ViewPropTypes.style,
    styleRowListInnerSelected: ViewPropTypes.style,
    styleRowColorSelected: ViewPropTypes.style,
    styleRowListInnerText: ViewPropTypes.style,
    label: PropTypes.string,
    labelTextStyle: ViewPropTypes.styles,
    labelContainerStyle: ViewPropTypes.styles,
    labelBulletStyle: ViewPropTypes.style,
    placeholderDisableColor: ViewPropTypes.style,
  };

  static defaultProps = {
    single: false,
    selectedItems: [],
    items: [],
    uniqueKey: '_id',
    tagBorderColor: colorPack.primary,
    tagTextColor: colorPack.primary,
    fontFamily: '',
    tagRemoveIconColor: colorPack.danger,
    onSelectedItemsChange: () => {},
    selectedItemFontFamily: '',
    selectedItemTextColor: colorPack.primary,
    itemFontFamily: '',
    itemTextColor: colorPack.textPrimary,
    itemFontSize: 16,
    selectedItemIconColor: colorPack.primary,
    searchInputPlaceholderText: 'Search',
    searchInputStyle: { color: colorPack.textPrimary },
    textColor: colorPack.textPrimary,
    selectText: 'Select',
    altFontFamily: '',
    hideSubmitButton: false,
    submitButtonColor: '#CCC',
    submitButtonText: 'Submit',
    fontSize: 14,
    fixedHeight: false,
    hideTags: false,
    hideDropdown: false,
    onChangeInput: () => {},
    displayKey: 'name',
    canAddItems: false,
    onAddItem: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      selector: false,
      searchTerm: ''
    };
  }

  shouldComponentUpdate() {
    // console.log('Component Updating: ', nextProps.selectedItems);
    return true;
  }

  getSelectedItemsExt = optionalSelctedItems => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}
    >
      {this._displaySelectedItems(optionalSelctedItems)}
    </View>
  );

  _onChangeInput = value => {
    const { onChangeInput } = this.props;
    if (onChangeInput) {
      onChangeInput(value);
    }
    this.setState({ searchTerm: value });
  };

  _getSelectLabel = () => {
    const { selectText, single, selectedItems, displayKey, placeholderDisableColor } = this.props;
    if (!selectedItems || selectedItems.length === 0) {
      return <Text style={ placeholderDisableColor }>{selectText}</Text>;
    } else if (single) {
      const item = selectedItems[0];
      const foundItem = this._findItem(item);
      return get(foundItem, displayKey) || selectText;
    }
    return selectText;
  };

  _findItem = itemKey => {
    const { items, uniqueKey } = this.props;
    return find(items, singleItem => singleItem[uniqueKey] === itemKey) || {};
  };

  _displaySelectedItems = optionalSelctedItems => {
    const {
      fontFamily,
      tagRemoveIconColor,
      tagBorderColor,
      uniqueKey,
      tagTextColor,
      selectedItems,
      displayKey
    } = this.props;
    const actualSelectedItems = optionalSelctedItems || selectedItems;
    return actualSelectedItems.map(singleSelectedItem => {
      const item = this._findItem(singleSelectedItem);
      if (!item[displayKey]) return null;
      return (
        <View
          style={[
            styles.selectedItem,
            {
              width: item[displayKey].length * 8 + 60,
              justifyContent: 'center',
              height: 40,
              borderColor: tagBorderColor
            }
          ]}
          key={item[uniqueKey]}
        >
          <Text
            style={[
              {
                flex: 1,
                color: red,
                fontSize: 15
              },
              fontFamily ? { fontFamily } : {}
            ] }
            numberOfLines={1}
          >
            {item[displayKey]}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this._removeItem(item);
            }}
          >
            <Icon
              name="close-circle"
              style={{
                color: tagRemoveIconColor,
                fontSize: 22,
                marginLeft: 10
              }}
            />
          </TouchableOpacity>
        </View>
      );
    });
  };

  _removeItem = item => {
    const { uniqueKey, selectedItems, onSelectedItemsChange } = this.props;
    const newItems = reject(
      selectedItems,
      singleItem => item[uniqueKey] === singleItem
    );
    // broadcast new selected items state to parent component
    onSelectedItemsChange(newItems);
  };

  _removeAllItems = () => {
    const { onSelectedItemsChange } = this.props;
    // broadcast new selected items state to parent component
    onSelectedItemsChange([]);
  };

  _clearSelector = () => {
    this.setState({
      selector: false
    });
  };

  _toggleSelector = () => {
    this.setState({
      selector: !this.state.selector
    });
  };

  _clearSearchTerm = () => {
    this.setState({
      searchTerm: ''
    });
  };

  _submitSelection = () => {
    this._toggleSelector();
    // reset searchTerm
    this._clearSearchTerm();
  };

  _itemSelected = item => {
    const { uniqueKey, selectedItems } = this.props;
    return selectedItems.indexOf(item[uniqueKey]) !== -1;
  };

  _addItem = () => {
    const {
      uniqueKey,
      items,
      selectedItems,
      onSelectedItemsChange,
      onAddItem
    } = this.props;
    let newItems = [];
    let newSelectedItems = [];
    const newItemName = this.state.searchTerm;
    if (newItemName) {
      const newItemId = newItemName
        .split(' ')
        .filter(word => word.length)
        .join('-');
      newItems = [...items, { [uniqueKey]: newItemId, name: newItemName }];
      newSelectedItems = [...selectedItems, newItemId];
      onAddItem(newItems);
      onSelectedItemsChange(newSelectedItems);
      this._clearSearchTerm();
    }
  };

  _toggleItem = item => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange
    } = this.props;
    if (single) {
      this._submitSelection();
      onSelectedItemsChange([item[uniqueKey]]);
    } else {
      const status = this._itemSelected(item);
      let newItems = [];
      if (status) {
        newItems = reject(
          selectedItems,
          singleItem => item[uniqueKey] === singleItem
        );
      } else {
        newItems = [...selectedItems, item[uniqueKey]];
      }
      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems);
    }
  };

  _itemStyle = item => {
    const {
      selectedItemFontFamily,
      selectedItemTextColor,
      itemFontFamily,
      itemTextColor,
      itemFontSize,
      styleIfItemDisabled,
      mainItemStyle,
      mainSelectedItemStyle
    } = this.props;
    const isSelected = this._itemSelected(item);
    const fontFamily = {};
    if (isSelected && selectedItemFontFamily) {
      fontFamily.fontFamily = selectedItemFontFamily;
    } else if (!isSelected && itemFontFamily) {
      fontFamily.fontFamily = itemFontFamily;
    }
    const color = isSelected
      ? { color: selectedItemxfTextColor }
      : { color: itemTextColor };
    const mainSelectedStyle = isSelected ? mainSelectedItemStyle : {};
    const styleIfDisabled = item.disabled ? { color: 'grey', ...styleIfItemDisabled } : {};
    return {
      ...fontFamily,
      ...color,
      fontSize: itemFontSize,
      ...(mainItemStyle || {}),
      ...mainSelectedStyle,
      ...styleIfDisabled
    };
  };

  _getRow = item => {
    const {
      selectedItemIconColor,
      displayKey,
      styleRowList,
      styleRowListInner,
      selectedItemRowIconStyle,
      styleRowListSelected,
      styleRowListInnerSelected,
      styleRowColorSelected,
      styleRowListInnerText // TODO: remove this unnecessary style
    } = this.props;
    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={() => this._toggleItem(item)}
        style={[
          { paddingLeft: 20, paddingRight: 20 },
          styleRowList,
          this._itemSelected(item) ? styleRowListSelected : {}
        ]}
      >
        <View>
          <View style={[{ flexDirection: 'row', alignItems: 'center' },
            styleRowListInner,
            this._itemSelected(item) ? styleRowListInnerSelected : {}
          ]}
          >
            <Text
              style={[
                styleRowListInnerText, {
                  flex: 1,
                  fontSize: 16,
                  paddingTop: 5,
                  paddingBottom: 5,
                  color: 'red',
                },
                this._itemStyle(item)
              ]}
            >
            {this._itemSelected(item) ?
              <Text style={styleRowColorSelected}>
                {item[displayKey]}
              </Text> :
              <Text>
                {item[displayKey]}
              </Text>
            }
            </Text>
            {this._itemSelected(item) ? (
              <Icon
                name="check"
                style={[{
                  fontSize: 20,
                  color: selectedItemIconColor
                }, selectedItemRowIconStyle]}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _getRowNew = item => (
    <TouchableOpacity
      disabled={item.disabled}
      onPress={() => this._addItem(item)}
      style={{ paddingLeft: 20, paddingRight: 20 }}
    >
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              styleRowListInnerText, {
                flex: 1,
                fontSize: 16,
                paddingTop: 5,
                paddingBottom: 5
              },
              this._itemStyle(item),
              item.disabled ? { color: 'grey' } : {}
            ]}
          >
            Add {item.name} (tap or press return)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  _filterItems = searchTerm => {
    const { items, displayKey } = this.props;
    const filteredItems = [];
    items.forEach(item => {
      const parts = searchTerm.trim().split(/[ \-:]+/);
      const regex = new RegExp(`(${parts.join('|')})`, 'ig');
      if (regex.test(get(item, displayKey))) {
        filteredItems.push(item);
      }
    });
    return filteredItems;
  };

  _renderItems = () => {
    const {
      canAddItems,
      items,
      fontFamily,
      uniqueKey,
      selectedItems,
      flatListProps,
      noItemRowStyle,
      noItemRowTextStyle,
      noItemText,
      itemsListWrapperStyle
    } = this.props;
    const { searchTerm } = this.state;
    let component = null;
    // If searchTerm matches an item in the list, we should not add a new
    // element to the list.
    let searchTermMatch;
    let itemList;
    let addItemRow;
    const renderItems = searchTerm ? this._filterItems(searchTerm) : items;
    if (renderItems.length) {
      itemList = (
        <FlatList
          data={renderItems}
          extraData={selectedItems}
          keyExtractor={item => item[uniqueKey]}
          renderItem={rowData => this._getRow(rowData.item)}
          {...flatListProps}
        />
      );
      searchTermMatch = renderItems.filter(item => item.name === searchTerm)
        .length;
    } else if (!canAddItems) {
      itemList = (
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, noItemRowStyle]}>
          <Text
            style={[
              {
                flex: 1,
                marginTop: 20,
                textAlign: 'center',
                color: colorPack.danger
              },
              fontFamily ? { fontFamily } : {},
              noItemRowTextStyle
            ]}
          >
            { noItemText || 'No item to display.'}
          </Text>
        </View>
      );
    }

    if (canAddItems && !searchTermMatch && searchTerm.length) {
      addItemRow = this._getRowNew({ name: searchTerm });
    }
    component = (
      <View style={itemsListWrapperStyle}>
        {itemList}
        {addItemRow}
      </View>
    );
    return component;
  };

  render() {
    const {
      selectedItems,
      single,
      fontFamily,
      altFontFamily,
      searchInputPlaceholderText,
      searchInputStyle,
      styleDropdownMenu,
      styleDropdownMenuSubsection,
      hideSubmitButton,
      hideDropdown,
      submitButtonColor,
      submitButtonText,
      fontSize,
      textColor,
      fixedHeight,
      hideTags,
      textInputProps,
      styleMainWrapper,
      styleInputGroup,
      styleItemsContainer,
      selectorViewStyle,
      inputIconStyle,
      inputIconName,
      downIconStyle,
      downIconName,
      styleItemsContainerWrapper,
      submitButtonStyle,
      submitButtonTextStyle,
      styleDropdownMenuWrapper,
      dropdownMenuTouchableStyle,
      dropdownMenuInTouchableViewStyle,
      dropdownMenuTextStyle,
      dropdownMenuIconStyle,
      arrowLeftIconStyle,
      arrowLeftIconName,
      dropdownMenuIconNameWhenHided,
      dropdownMenuIconNameWhenOpened,
      disableSearch,
      label,
      labelTextStyle,
      labelContainerStyle,
      labelBulletStyle
    } = this.props;
    const { searchTerm, selector } = this.state;
    return (
      <View
        style={[
          {flexDirection: 'column'},
          styleMainWrapper
        ]}
      >
      { label ?
        <View style={ labelContainerStyle }>
          <Text>
            <Text style={[labelTextStyle]}>
            { label}</Text>
            <Text style={labelBulletStyle}>:</Text>
          </Text>
        </View>
      : null }
        {selector ? (
          <View style={[styles.selectorView(fixedHeight), selectorViewStyle]}>
            <View
              style={[styles.inputGroup, styleInputGroup]}
            >
              { !disableSearch &&
                <Icon
                  name={ inputIconName || "magnify"}
                  size={20}
                  color={colorPack.placeholderTextColor}
                  style={[{ marginRight: 10 }, inputIconStyle]}
                />
              }

              { disableSearch ?
                <Text
                  underlineColorAndroid="transparent"
                  style={[{ flex: 1 }, searchInputStyle]}
                >
                  {searchInputPlaceholderText}
                </Text>
                : <TextInput
                  autoFocus={!disableSearch}
                  onChangeText={this._onChangeInput}
                  onSubmitEditing={this._addItem}
                  placeholder={searchInputPlaceholderText}
                  placeholderTextColor={colorPack.placeholderTextColor}
                  underlineColorAndroid="transparent"
                  style={[{ flex: 1 }, searchInputStyle]}
                  value={searchTerm}
                  editable={!disableSearch}
                  {...textInputProps}
                />
              }
              {hideSubmitButton && (
                <TouchableOpacity onPress={this._submitSelection}>
                  <Icon
                    name={downIconName || "menu-down"}
                    style={[
                      styles.indicator,
                      { paddingLeft: 15, paddingRight: 15 },
                      downIconStyle
                    ]}
                  />
                </TouchableOpacity>
              )}
              {!hideDropdown && (
                <Icon
                  name={arrowLeftIconName || "arrow-left"}
                  size={28}
                  onPress={this._clearSelector}
                  color={colorPack.placeholderTextColor}
                  style={[{ marginLeft: 5 }, arrowLeftIconStyle]}
                />
              )}
            </View>
            <TouchableWithoutFeedback
              style={{}}
            >
              <View
                style={[{
                  flexDirection: 'column',
                  backgroundColor: '#fafafa'
                }, styleItemsContainerWrapper]}
              >
                <View style={styleItemsContainer}>
                  {this._renderItems()}
                </View>
                {!single && !hideSubmitButton && (
                  <TouchableOpacity
                    onPress={() => this._submitSelection()}
                    style={[
                      styles.button,
                      { backgroundColor: submitButtonColor },
                      submitButtonStyle
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        fontFamily ? { fontFamily } : {},
                        submitButtonTextStyle
                      ]}
                    >
                      {submitButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={styleDropdownMenuWrapper}>
            <View
              style={[
                styles.dropdownView,
                styleDropdownMenu
              ]}
            >
              <View
                style={[
                  styles.subSection,
                  { paddingTop: 10, paddingBottom: 10 },
                  styleDropdownMenuSubsection
                ]}
              >
                <TouchableWithoutFeedback
                  onPress={this._toggleSelector}
                  style={dropdownMenuTouchableStyle}
                >
                  <View
                    style={[{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }, dropdownMenuInTouchableViewStyle]}
                  >
                    <Text
                      style={[
                        {
                          flex: 1,
                          fontSize: fontSize || 16,
                          color: textColor || colorPack.placeholderTextColor
                        },
                        altFontFamily
                          ? { fontFamily: altFontFamily }
                          : fontFamily
                          ? { fontFamily }
                          : {},
                        dropdownMenuTextStyle
                      ]}
                      numberOfLines={1}
                    >
                      {this._getSelectLabel()}
                    </Text>
                    <Icon
                      name={hideSubmitButton
                        ? (dropdownMenuIconNameWhenHided || 'menu-right')
                        : (dropdownMenuIconNameWhenOpened || 'menu-down')
                      }
                      style={[styles.indicator, dropdownMenuIconStyle]}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {!single && !hideTags && selectedItems.length ? (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                {this._displaySelectedItems()}
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

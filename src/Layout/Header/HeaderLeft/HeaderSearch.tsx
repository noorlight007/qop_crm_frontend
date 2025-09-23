import { SearchQOP } from "@/Constant";
import { getMenuByRole } from "@/Data/Layout/SidebarData";
import { useAppDispatch } from "@/Redux/Hooks";
import { MenuItem, SearchSuggestionItem } from "@/Types/LayoutTypes";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import SearchSuggestionList from "./SearchSuggestionList";

const HeaderSearch = () => {
  const [arr, setArr] = useState<SearchSuggestionItem[]>([]);
  const [searchedWord, setSearchedWord] = useState<string>("");
  const [searchedArray, setSearchedArray] = useState<SearchSuggestionItem[]>(
    []
  );
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    const suggestionArray: SearchSuggestionItem[] = [];
    let num = 0;
    const getAllLink = (item: MenuItem, icon: string | undefined) => {
      if (item.children) {
        item.children.forEach((ele) => {
          getAllLink(ele, icon);
        });
      } else {
        num = num + 1;
        suggestionArray.push({
          icon: icon,
          title: item.title,
          path: item.path ? item.path : "",
          bookmarked: false,
          id: num,
        });
      }
    };

    // Get menu based on user role
    const roleBasedMenu = session?.user?.user_type
      ? getMenuByRole(session.user.user_type)
      : [];

    roleBasedMenu.forEach((item) => {
      item.Items?.forEach((child) => {
        getAllLink(child, child.icon);
      });
    });

    setArr(suggestionArray);
  }, [session]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (!searchedWord) setSearchedWord("");
    setSearchedWord(e.target.value);
    const result = arr.filter((item) =>
      item.title?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchedArray(result);
  };

  return (
    <>
      <div className="form-group-header d-lg-block d-none">
        <div className="Typeahead Typeahead--twitterUsers">
          <div className="u-posRelative d-flex align-items-center">
            <input
              onChange={(e) => handleSearch(e)}
              value={searchedWord}
              className="demo-input py-0 Typeahead-input form-control-plaintext w-100"
              type="text"
              placeholder={SearchQOP}
            />
            <i className="search-bg iconly-Search icli" />
          </div>
        </div>
      </div>
      <div
        className={`Typeahead-menu header-menu custom-scrollbar ${
          searchedWord.length ? "is-open" : ""
        }`}
      >
        <SearchSuggestionList
          searchedArray={searchedArray}
          setSearchedWord={setSearchedWord}
        />
      </div>
    </>
  );
};

export default HeaderSearch;

import { socialLinksData } from "@/Data/Pages/PagesData";
import { SocialLinksProp } from "@/Types/PagesType";
import Link from "next/link";
import { FormGroup } from "reactstrap";

export const SocialLinks: React.FC<SocialLinksProp> = ({
  logtext,
  btntext,
}) => {
  return (
    <>
      <div className="login-social-title">
        <h6>{"Or Sign in with"}</h6>
      </div>
      <FormGroup>
        <ul className="login-social simple-list flex-row">
          {socialLinksData.map((item) => (
            <li key={item.id}>
              <Link href={item.link} target="_blank">
                <i className={`icon-${item.icon}`} />
              </Link>
            </li>
          ))}
        </ul>
      </FormGroup>
      {/* <p className="mt-4 mb-0 text-center">
        {logtext ? logtext : "Don't have account?"}
        {!logtext && !btntext ? (
          <Link className="ms-2" href={`/others/authentication/registersimple`}>
            {CreateAccount}
          </Link>
        ) : (
          <Link href={`/others/authentication/loginsimple`} className="ms-2">
            {btntext}
          </Link>
        )}
      </p> */}
    </>
  );
};

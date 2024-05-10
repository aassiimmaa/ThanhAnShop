import classNames from "classnames/bind";
import styles from "./Button.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)

function Button({to, href, className, primary = false, outline = false, text = false, disabled = false, rounded = false, small = false, medium = false, large = false, leftIcon = false, rightIcon = false, children, onClick, ...passProps}) {

    let Comp = 'button';
    const props = {
        onClick,
        ...passProps
    };

    if (disabled){
        delete props.onClick
    }

    if(to){
        props.to = to;
        Comp = Link;
    }else if(href){
        props.href = href;
        Comp = 'a'
    }

    const classes = cx('wrapper', {[className]: className, primary, outline, text, disabled, rounded, small, large}) ;


    return ( 
        <Comp className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

export default Button;
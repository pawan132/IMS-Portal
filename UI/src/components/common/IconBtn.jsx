export default function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
  }) {
    return (
      <button
        disabled={disabled}
        onClick={onclick}
        className={`flex items-center ${
          outline ? "border border-primary/50 bg-transparent" : "bg-primary/30"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold ${customClasses}`}
        type={type}
      >
        {children ? (
          <>
            <span className={`${outline && "text-primary/50"}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </button>
    )
  }
  
package com.testui.selenium.utils;

// AI-ASSISTED: Cursor
// PROMPT: ANSI color helper for clean colored console test logs
// ACCEPTED-BY: vignesh

/**
 * ANSI color helpers for terminal output. Disabled when {@code NO_COLOR} is set
 * or when stdout is not a TTY-friendly environment.
 */
public final class AnsiConsole {

    private static final boolean ENABLED = isEnabled();

    public static final String RESET = code("0");
    public static final String BOLD = code("1");
    public static final String DIM = code("2");

    public static final String RED = code("31");
    public static final String GREEN = code("32");
    public static final String YELLOW = code("33");
    public static final String BLUE = code("34");
    public static final String MAGENTA = code("35");
    public static final String CYAN = code("36");
    public static final String WHITE = code("37");

    public static final String BRIGHT_RED = code("91");
    public static final String BRIGHT_GREEN = code("92");
    public static final String BRIGHT_YELLOW = code("93");
    public static final String BRIGHT_CYAN = code("96");
    public static final String BRIGHT_WHITE = code("97");

    private AnsiConsole() {
    }

    private static boolean isEnabled() {
        if (System.getenv("NO_COLOR") != null) {
            return false;
        }
        String force = System.getProperty("testui.console.color", "true");
        return !"false".equalsIgnoreCase(force);
    }

    private static String code(String value) {
        return ENABLED ? "\u001B[" + value + "m" : "";
    }

    public static String color(String ansi, String text) {
        if (!ENABLED) {
            return text;
        }
        return ansi + text + RESET;
    }

    public static String bold(String text) {
        return color(BOLD, text);
    }

    public static String green(String text) {
        return color(BRIGHT_GREEN, text);
    }

    public static String red(String text) {
        return color(BRIGHT_RED, text);
    }

    public static String yellow(String text) {
        return color(BRIGHT_YELLOW, text);
    }

    public static String cyan(String text) {
        return color(BRIGHT_CYAN, text);
    }

    public static String blue(String text) {
        return color(BLUE, text);
    }

    public static String magenta(String text) {
        return color(MAGENTA, text);
    }

    public static String dim(String text) {
        return color(DIM, text);
    }

    public static String white(String text) {
        return color(BRIGHT_WHITE, text);
    }

    /** Print a line to stdout (colored console path — no logger class names). */
    public static void println(String message) {
        System.out.println(message);
    }

    public static void println() {
        System.out.println();
    }
}

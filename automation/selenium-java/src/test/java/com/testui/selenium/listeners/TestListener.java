package com.testui.selenium.listeners;

// AI-ASSISTED: Cursor
// PROMPT: Colored clean console logs without class names
// ACCEPTED-BY: vignesh

import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.MediaEntityBuilder;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.markuputils.ExtentColor;
import com.aventstack.extentreports.markuputils.MarkupHelper;
import com.testui.selenium.utils.AnsiConsole;
import com.testui.selenium.utils.ExtentReportManager;
import com.testui.selenium.utils.ScreenshotUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.ISuiteResult;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestNGMethod;
import org.testng.ITestResult;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Colored, clean console reporting + ExtentReports (no logger/class-name noise).
 */
public class TestListener implements ITestListener, ISuiteListener {

    /** File-only plain logs (console uses {@link AnsiConsole}). */
    private static final Logger FILE_LOG = LogManager.getLogger("TESTUI_FILE");
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final String BAR = "────────────────────────────────────────────────────────";

    private Instant suiteStart;

    @Override
    public void onStart(ISuite suite) {
        suiteStart = Instant.now();
        ExtentReportManager.getInstance();

        AnsiConsole.println();
        AnsiConsole.println(AnsiConsole.cyan(BAR));
        AnsiConsole.println(AnsiConsole.bold(AnsiConsole.cyan("  ▶  SUITE STARTED")));
        AnsiConsole.println(AnsiConsole.cyan(BAR));
        row("Suite", suite.getName());
        row("Time", LocalDateTime.now().format(TIME));
        row("Report", ExtentReportManager.getReportPath());
        AnsiConsole.println(AnsiConsole.cyan(BAR));
        AnsiConsole.println();

        FILE_LOG.info("Suite started: {}", suite.getName());
    }

    @Override
    public void onFinish(ISuite suite) {
        ExtentReportManager.flush();

        int passed = 0;
        int failed = 0;
        int skipped = 0;
        for (ISuiteResult result : suite.getResults().values()) {
            ITestContext ctx = result.getTestContext();
            passed += ctx.getPassedTests().size();
            failed += ctx.getFailedTests().size();
            skipped += ctx.getSkippedTests().size();
        }
        int total = passed + failed + skipped;
        long ms = suiteStart == null ? 0 : Duration.between(suiteStart, Instant.now()).toMillis();
        boolean ok = failed == 0;

        AnsiConsole.println();
        AnsiConsole.println(ok ? AnsiConsole.green(BAR) : AnsiConsole.red(BAR));
        AnsiConsole.println(ok
                ? AnsiConsole.bold(AnsiConsole.green("  ✔  SUITE FINISHED — SUCCESS"))
                : AnsiConsole.bold(AnsiConsole.red("  ✘  SUITE FINISHED — FAILED")));
        AnsiConsole.println(ok ? AnsiConsole.green(BAR) : AnsiConsole.red(BAR));
        row("Suite", suite.getName());
        row("Total", String.valueOf(total));
        AnsiConsole.println("  " + AnsiConsole.dim("Passed ") + AnsiConsole.green(String.valueOf(passed))
                + AnsiConsole.dim("   Failed ") + (failed > 0 ? AnsiConsole.red(String.valueOf(failed)) : "0")
                + AnsiConsole.dim("   Skipped ") + (skipped > 0 ? AnsiConsole.yellow(String.valueOf(skipped)) : "0"));
        row("Duration", formatDuration(ms));
        row("Report", ExtentReportManager.getReportPath());
        AnsiConsole.println(ok ? AnsiConsole.green(BAR) : AnsiConsole.red(BAR));
        AnsiConsole.println();

        FILE_LOG.info("Suite finished: {} | passed={} failed={} skipped={} duration={}",
                suite.getName(), passed, failed, skipped, formatDuration(ms));
    }

    @Override
    public void onTestStart(ITestResult result) {
        ITestNGMethod method = result.getMethod();
        String name = method.getMethodName();
        String description = blankTo(method.getDescription(), "(no description)");
        String className = shortClass(result.getTestClass().getName());
        String params = formatParams(result.getParameters());

        ExtentTest test = ExtentReportManager.getInstance()
                .createTest(name, description)
                .assignCategory(className)
                .assignDevice(System.getProperty("browser", "chrome"));
        ExtentReportManager.setTest(test);
        test.info("Description: " + description);
        if (!params.isBlank()) {
            test.info("Parameters : " + params);
        }
        test.info("Started at : " + LocalDateTime.now().format(TIME));

        AnsiConsole.println(AnsiConsole.dim("  ······················································"));
        AnsiConsole.println(AnsiConsole.blue("  ▶ START  ") + AnsiConsole.bold(name));
        AnsiConsole.println(AnsiConsole.dim("           ") + description);
        if (!params.isBlank()) {
            AnsiConsole.println(AnsiConsole.dim("           params: ") + params);
        }

        FILE_LOG.info("START {} — {}", name, description);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        long ms = result.getEndMillis() - result.getStartMillis();
        String name = result.getMethod().getMethodName();

        ExtentTest test = ExtentReportManager.getTest();
        if (test != null) {
            test.log(Status.PASS, MarkupHelper.createLabel("PASSED", ExtentColor.GREEN));
            test.pass("Duration: " + formatDuration(ms));
        }

        AnsiConsole.println(AnsiConsole.green("  ✔ PASS   ")
                + AnsiConsole.bold(AnsiConsole.green(name))
                + AnsiConsole.dim("  (" + formatDuration(ms) + ")"));

        FILE_LOG.info("PASS {} ({})", name, formatDuration(ms));
    }

    @Override
    public void onTestFailure(ITestResult result) {
        long ms = result.getEndMillis() - result.getStartMillis();
        String name = result.getMethod().getMethodName();
        Throwable error = result.getThrowable();
        String reason = error == null ? "Unknown error" : firstLine(error);

        AnsiConsole.println(AnsiConsole.red("  ✘ FAIL   ")
                + AnsiConsole.bold(AnsiConsole.red(name))
                + AnsiConsole.dim("  (" + formatDuration(ms) + ")"));
        AnsiConsole.println(AnsiConsole.red("           ") + reason);

        FILE_LOG.error("FAIL {} ({}) — {}", name, formatDuration(ms), reason);

        ExtentTest test = ExtentReportManager.getTest();
        if (test == null) {
            return;
        }

        test.log(Status.FAIL, MarkupHelper.createLabel("FAILED", ExtentColor.RED));
        test.fail("Duration : " + formatDuration(ms));
        test.fail("Reason   : " + reason);
        if (error != null) {
            test.fail(error);
        }

        try {
            String path = ScreenshotUtils.capture(name);
            String base64 = ScreenshotUtils.captureBase64();
            if (base64 != null) {
                test.fail("Screenshot at failure",
                        MediaEntityBuilder.createScreenCaptureFromBase64String(base64).build());
            }
            if (path != null) {
                test.info("Screenshot file: " + path);
                AnsiConsole.println(AnsiConsole.magenta("           screenshot: ") + AnsiConsole.dim(path));
                FILE_LOG.info("Screenshot: {}", path);
            }
        } catch (Exception e) {
            test.warning("Could not capture screenshot: " + e.getMessage());
            FILE_LOG.warn("Could not attach screenshot", e);
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        long ms = Math.max(0, result.getEndMillis() - result.getStartMillis());
        String name = result.getMethod().getMethodName();
        String reason = result.getThrowable() == null
                ? "Skipped (dependency or configuration)"
                : firstLine(result.getThrowable());

        ExtentTest test = ExtentReportManager.getTest();
        if (test != null) {
            test.log(Status.SKIP, MarkupHelper.createLabel("SKIPPED", ExtentColor.ORANGE));
            test.skip(reason);
        }

        AnsiConsole.println(AnsiConsole.yellow("  ■ SKIP   ")
                + AnsiConsole.bold(AnsiConsole.yellow(name))
                + AnsiConsole.dim("  (" + formatDuration(ms) + ")"));
        AnsiConsole.println(AnsiConsole.yellow("           ") + reason);

        FILE_LOG.warn("SKIP {} — {}", name, reason);
    }

    @Override
    public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
        onTestFailure(result);
    }

    private static void row(String label, String value) {
        AnsiConsole.println("  " + AnsiConsole.dim(pad(label, 10)) + value);
    }

    private static String pad(String text, int width) {
        if (text.length() >= width) {
            return text + " ";
        }
        return text + " ".repeat(width - text.length());
    }

    private static String shortClass(String fqcn) {
        if (fqcn == null) {
            return "Unknown";
        }
        int dot = fqcn.lastIndexOf('.');
        return dot >= 0 ? fqcn.substring(dot + 1) : fqcn;
    }

    private static String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private static String formatParams(Object[] params) {
        if (params == null || params.length == 0) {
            return "";
        }
        return Arrays.stream(params)
                .map(p -> p == null ? "null" : String.valueOf(p))
                .collect(Collectors.joining(", "));
    }

    private static String formatDuration(long millis) {
        if (millis < 1000) {
            return millis + " ms";
        }
        long seconds = millis / 1000;
        long remMs = millis % 1000;
        if (seconds < 60) {
            return seconds + "." + String.format("%03d", remMs) + " s";
        }
        long minutes = seconds / 60;
        long remSec = seconds % 60;
        return minutes + "m " + remSec + "s";
    }

    private static String firstLine(Throwable t) {
        String msg = t.getMessage();
        if (msg == null || msg.isBlank()) {
            return t.getClass().getSimpleName();
        }
        int nl = msg.indexOf('\n');
        String first = nl > 0 ? msg.substring(0, nl) : msg;
        return t.getClass().getSimpleName() + ": " + first.trim();
    }
}

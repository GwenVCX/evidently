import abc
from typing import Generator
from typing import Generic
from typing import List

from evidently.future.metric_types import MeanStdMetric
from evidently.future.metric_types import MeanStdValue
from evidently.future.metric_types import MetricTestResult
from evidently.future.metric_types import SingleValue
from evidently.future.metric_types import SingleValueMetric
from evidently.future.metric_types import TMeanStdMetric
from evidently.future.metric_types import TSingleValueMetric
from evidently.future.metrics._legacy import LegacyMetricCalculation
from evidently.future.report import Context
from evidently.metrics import RegressionDummyMetric
from evidently.metrics.regression_performance.regression_dummy_metric import RegressionDummyMetricResults
from evidently.metrics.regression_performance.regression_quality import RegressionQualityMetric
from evidently.metrics.regression_performance.regression_quality import RegressionQualityMetricResults
from evidently.model.widget import BaseWidgetInfo


class LegacyRegressionMeanStdMetric(
    LegacyMetricCalculation[MeanStdValue, TMeanStdMetric, RegressionQualityMetricResults, RegressionQualityMetric],
    Generic[TMeanStdMetric],
    abc.ABC,
):
    def legacy_metric(self) -> RegressionQualityMetric:
        return RegressionQualityMetric()

    def get_tests(self, value: MeanStdValue) -> Generator[MetricTestResult, None, None]:
        # todo: do not call to_metric here
        yield from (t.to_test()(self, value.get_mean()) for t in self.metric.mean_tests)
        yield from (t.to_test()(self, value.get_std()) for t in self.metric.std_tests)


class LegacyRegressionSingleValueMetric(
    LegacyMetricCalculation[SingleValue, TSingleValueMetric, RegressionQualityMetricResults, RegressionQualityMetric],
    Generic[TSingleValueMetric],
    abc.ABC,
):
    def legacy_metric(self) -> RegressionQualityMetric:
        return RegressionQualityMetric()

    def get_tests(self, value: SingleValue) -> Generator[MetricTestResult, None, None]:
        yield from (t.to_test()(self, value) for t in self.metric.tests)


class MeanError(MeanStdMetric):
    pass


class MeanErrorCalculation(LegacyRegressionMeanStdMetric[MeanError]):
    def calculate_value(
        self, context: Context, legacy_result: RegressionQualityMetricResults, render: List[BaseWidgetInfo]
    ) -> MeanStdValue:
        return MeanStdValue(legacy_result.current.mean_error, legacy_result.current.error_std)

    def display_name(self) -> str:
        return "Mean Error"


class MAE(MeanStdMetric):
    pass


class MAECalculation(LegacyRegressionMeanStdMetric[MAE]):
    def calculate_value(
        self, context: Context, legacy_result: RegressionQualityMetricResults, render: List[BaseWidgetInfo]
    ) -> MeanStdValue:
        return MeanStdValue(legacy_result.current.mean_abs_error, legacy_result.current.abs_error_std)

    def display_name(self) -> str:
        return "Mean Absolute Error"


class RMSE(SingleValueMetric):
    pass


class RMSECalculation(LegacyRegressionSingleValueMetric[RMSE]):
    def calculate_value(
        self, context: Context, legacy_result: RegressionQualityMetricResults, render: List[BaseWidgetInfo]
    ) -> SingleValue:
        return SingleValue(legacy_result.current.rmse)

    def display_name(self) -> str:
        return "RMSE"


class MAPE(MeanStdMetric):
    pass


class MAPECalculation(LegacyRegressionMeanStdMetric[MAPE]):
    def calculate_value(
        self, context: Context, legacy_result: RegressionQualityMetricResults, render: List[BaseWidgetInfo]
    ) -> MeanStdValue:
        return MeanStdValue(legacy_result.current.mean_abs_perc_error, legacy_result.current.abs_perc_error_std)

    def display_name(self) -> str:
        return "Mean Absolute Percentage Error"


class R2Score(SingleValueMetric):
    pass


class R2ScoreCalculation(LegacyRegressionSingleValueMetric[R2Score]):
    def calculate_value(
        self, context: Context, legacy_result: RegressionQualityMetricResults, render: List[BaseWidgetInfo]
    ) -> SingleValue:
        return SingleValue(legacy_result.current.r2_score)

    def display_name(self) -> str:
        return "R2 Score"


class AbsMaxError(SingleValueMetric):
    pass


class AbsMaxErrorCalculation(LegacyRegressionSingleValueMetric[AbsMaxError]):
    def calculate_value(
        self, context: Context, legacy_result: RegressionQualityMetricResults, render: List[BaseWidgetInfo]
    ) -> SingleValue:
        return SingleValue(legacy_result.current.abs_error_max)

    def display_name(self) -> str:
        return "Absolute Max Error"


class LegacyRegressionDummyMeanStdMetric(
    LegacyMetricCalculation[MeanStdValue, TMeanStdMetric, RegressionDummyMetricResults, RegressionDummyMetric],
    Generic[TMeanStdMetric],
    abc.ABC,
):
    def legacy_metric(self) -> RegressionDummyMetric:
        return RegressionDummyMetric()

    def get_tests(self, value: MeanStdValue) -> Generator[MetricTestResult, None, None]:
        # todo: do not call to_metric here
        yield from (t.to_test()(self, value.get_mean()) for t in self.metric.mean_tests)
        yield from (t.to_test()(self, value.get_std()) for t in self.metric.std_tests)


class LegacyRegressionDummyValueMetric(
    LegacyMetricCalculation[SingleValue, TSingleValueMetric, RegressionDummyMetricResults, RegressionDummyMetric],
    Generic[TSingleValueMetric],
    abc.ABC,
):
    def legacy_metric(self) -> RegressionDummyMetric:
        return RegressionDummyMetric()

    def get_tests(self, value: SingleValue) -> Generator[MetricTestResult, None, None]:
        yield from (t.to_test()(self, value) for t in self.metric.tests)


class DummyMAE(SingleValueMetric):
    pass


class DummyMAECalculation(LegacyRegressionDummyValueMetric[DummyMAE]):
    def calculate_value(
        self,
        context: "Context",
        legacy_result: RegressionDummyMetricResults,
        render: List[BaseWidgetInfo],
    ) -> SingleValue:
        if legacy_result.mean_abs_error is None:
            raise ValueError("No mean absolute error was calculated")
        return SingleValue(legacy_result.mean_abs_error)

    def display_name(self) -> str:
        return "Dummy Mean Absolute Error"


class DummyMAPE(SingleValueMetric):
    pass


class DummyMAPECalculation(LegacyRegressionDummyValueMetric[DummyMAPE]):
    def calculate_value(
        self,
        context: "Context",
        legacy_result: RegressionDummyMetricResults,
        render: List[BaseWidgetInfo],
    ) -> SingleValue:
        if legacy_result.mean_abs_perc_error is None:
            raise ValueError("No mean absolute percentage error was calculated")
        return SingleValue(legacy_result.mean_abs_perc_error)

    def display_name(self) -> str:
        return "Dummy Mean Absolute Percentage Error"


class DummyRMSE(SingleValueMetric):
    pass


class DummyRMSECalculation(LegacyRegressionDummyValueMetric[DummyRMSE]):
    def calculate_value(
        self,
        context: "Context",
        legacy_result: RegressionDummyMetricResults,
        render: List[BaseWidgetInfo],
    ) -> SingleValue:
        if legacy_result.rmse is None:
            raise ValueError("No RMSE was calculated")
        return SingleValue(legacy_result.rmse)

    def display_name(self) -> str:
        return "Dummy RMSE"
